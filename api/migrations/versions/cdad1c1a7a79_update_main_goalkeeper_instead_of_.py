"""Update: main goalkeeper instead of goalkeeper

Revision ID: cdad1c1a7a79
Revises: 11a8a90e2bd9
Create Date: 2022-11-10 16:52:23.856818

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cdad1c1a7a79'
down_revision = '11a8a90e2bd9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('match_monitoring', sa.Column('main_goalkeeper_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.drop_constraint('match_monitoring_goalkeeper_id_fkey', 'match_monitoring', type_='foreignkey')
    op.create_foreign_key(None, 'match_monitoring', 'goalkeeper', ['main_goalkeeper_id'], ['id'])
    op.drop_column('match_monitoring', 'goalkeeper_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('match_monitoring', sa.Column('goalkeeper_id', postgresql.UUID(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'match_monitoring', type_='foreignkey')
    op.create_foreign_key('match_monitoring_goalkeeper_id_fkey', 'match_monitoring', 'goalkeeper', ['goalkeeper_id'], ['id'])
    op.drop_column('match_monitoring', 'main_goalkeeper_id')
    # ### end Alembic commands ###
